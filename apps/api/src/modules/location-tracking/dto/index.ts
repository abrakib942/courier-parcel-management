import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLocationTrackingDto {
  @IsNumber()
  @IsNotEmpty()
  parcelId: number;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class UpdateLocationTrackingDto extends CreateLocationTrackingDto {}
