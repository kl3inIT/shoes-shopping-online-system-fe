import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface VietnamAddressSelectorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  error?: string;
  className?: string;
}

const VN_API = 'https://provinces.open-api.vn/api';

function buildAddress(
  street: string,
  ward: Ward | null,
  district: District | null,
  province: Province | null
): string {
  return [street.trim(), ward?.name, district?.name, province?.name]
    .filter(Boolean)
    .join(', ');
}

export function VietnamAddressSelector({
  value,
  onChange,
  readOnly = false,
  error,
  className,
}: VietnamAddressSelectorProps) {
  const { t } = useTranslation();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [street, setStreet] = useState(value ?? '');

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Fetch provinces once on mount
  useEffect(() => {
    setLoadingProvinces(true);
    fetch(`${VN_API}/p/`)
      .then((r) => r.json())
      .then((data: Province[]) => setProvinces(data))
      .catch(console.error)
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
      return;
    }
    setLoadingDistricts(true);
    fetch(`${VN_API}/p/${selectedProvince.code}?depth=2`)
      .then((r) => r.json())
      .then((data: Province & { districts: District[] }) =>
        setDistricts(data.districts ?? [])
      )
      .catch(console.error)
      .finally(() => setLoadingDistricts(false));
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard(null);
      return;
    }
    setLoadingWards(true);
    fetch(`${VN_API}/d/${selectedDistrict.code}?depth=2`)
      .then((r) => r.json())
      .then((data: District & { wards: Ward[] }) => setWards(data.wards ?? []))
      .catch(console.error)
      .finally(() => setLoadingWards(false));
  }, [selectedDistrict]);

  // Reset internal state when entering edit mode (value changes from outside)
  useEffect(() => {
    setStreet(value ?? '');
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
  }, [readOnly]);

  if (readOnly) {
    return (
      <p
        className={cn(
          'min-h-[2.5rem] whitespace-pre-line text-sm',
          !value && 'text-muted-foreground',
          className
        )}
      >
        {value || t('profile.common.notProvided')}
      </p>
    );
  }

  const handleProvinceChange = (code: string) => {
    const province = provinces.find((p) => String(p.code) === code) ?? null;
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    onChange(buildAddress(street, null, null, province));
  };

  const handleDistrictChange = (code: string) => {
    const district = districts.find((d) => String(d.code) === code) ?? null;
    setSelectedDistrict(district);
    setSelectedWard(null);
    onChange(buildAddress(street, null, district, selectedProvince));
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find((w) => String(w.code) === code) ?? null;
    setSelectedWard(ward);
    onChange(buildAddress(street, ward, selectedDistrict, selectedProvince));
  };

  const handleStreetChange = (val: string) => {
    setStreet(val);
    onChange(
      buildAddress(val, selectedWard, selectedDistrict, selectedProvince)
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className='grid gap-3 sm:grid-cols-3'>
        {/* Province */}
        <div className='space-y-1.5'>
          <Label className='text-xs text-muted-foreground'>
            {t('profile.address.province', 'Tỉnh / Thành phố')}
          </Label>
          <Select
            value={selectedProvince ? String(selectedProvince.code) : ''}
            onValueChange={handleProvinceChange}
            disabled={loadingProvinces}
          >
            <SelectTrigger className={cn(error && 'border-destructive')}>
              <SelectValue
                placeholder={
                  loadingProvinces
                    ? t('common.loading')
                    : t('profile.address.selectProvince', 'Chọn tỉnh/thành')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={String(p.code)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className='space-y-1.5'>
          <Label className='text-xs text-muted-foreground'>
            {t('profile.address.district', 'Quận / Huyện')}
          </Label>
          <Select
            value={selectedDistrict ? String(selectedDistrict.code) : ''}
            onValueChange={handleDistrictChange}
            disabled={!selectedProvince || loadingDistricts}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingDistricts
                    ? t('common.loading')
                    : t('profile.address.selectDistrict', 'Chọn quận/huyện')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.code} value={String(d.code)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward */}
        <div className='space-y-1.5'>
          <Label className='text-xs text-muted-foreground'>
            {t('profile.address.ward', 'Phường / Xã')}
          </Label>
          <Select
            value={selectedWard ? String(selectedWard.code) : ''}
            onValueChange={handleWardChange}
            disabled={!selectedDistrict || loadingWards}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingWards
                    ? t('common.loading')
                    : t('profile.address.selectWard', 'Chọn phường/xã')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.code} value={String(w.code)}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Street address */}
      <Input
        value={street}
        onChange={(e) => handleStreetChange(e.target.value)}
        placeholder={t(
          'profile.address.streetPlaceholder',
          'Số nhà, tên đường...'
        )}
        className={cn(error && 'border-destructive')}
      />

      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}
