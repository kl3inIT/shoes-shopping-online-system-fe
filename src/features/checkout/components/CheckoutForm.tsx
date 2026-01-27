import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
}

export interface CheckoutFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  cities?: { value: string; label: string }[];
  districts?: { value: string; label: string }[];
  wards?: { value: string; label: string }[];
  errors?: Partial<Record<keyof ShippingAddress, string>>;
}

export function CheckoutForm({
  address,
  onChange,
  cities = [],
  districts = [],
  wards = [],
  errors = {},
}: CheckoutFormProps) {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Full Name *</Label>
            <Input
              id='fullName'
              placeholder='Enter your full name'
              value={address.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className='text-xs text-destructive'>{errors.fullName}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone Number *</Label>
            <Input
              id='phone'
              placeholder='Enter your phone number'
              value={address.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className='text-xs text-destructive'>{errors.phone}</p>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email *</Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter your email'
            value={address.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className='text-xs text-destructive'>{errors.email}</p>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor='city'>City/Province *</Label>
            <Select
              value={address.city}
              onValueChange={(value) => handleChange('city', value)}
            >
              <SelectTrigger
                className={errors.city ? 'border-destructive' : ''}
              >
                <SelectValue placeholder='Select city' />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className='text-xs text-destructive'>{errors.city}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='district'>District *</Label>
            <Select
              value={address.district}
              onValueChange={(value) => handleChange('district', value)}
              disabled={!address.city}
            >
              <SelectTrigger
                className={errors.district ? 'border-destructive' : ''}
              >
                <SelectValue placeholder='Select district' />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className='text-xs text-destructive'>{errors.district}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ward'>Ward *</Label>
            <Select
              value={address.ward}
              onValueChange={(value) => handleChange('ward', value)}
              disabled={!address.district}
            >
              <SelectTrigger
                className={errors.ward ? 'border-destructive' : ''}
              >
                <SelectValue placeholder='Select ward' />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward.value} value={ward.value}>
                    {ward.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ward && (
              <p className='text-xs text-destructive'>{errors.ward}</p>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='address'>Street Address *</Label>
          <Input
            id='address'
            placeholder='House number, street name'
            value={address.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && (
            <p className='text-xs text-destructive'>{errors.address}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='note'>Order Note (optional)</Label>
          <Textarea
            id='note'
            placeholder='Add any special instructions for delivery...'
            value={address.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CheckoutForm;
