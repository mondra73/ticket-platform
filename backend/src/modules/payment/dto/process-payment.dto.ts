import { IsInt, IsString, Length, Matches } from 'class-validator';

export class ProcessPaymentDto {
  @IsInt()
  orderId: number;

  @IsString()
  @Length(16, 16)
  @Matches(/^\d+$/, { message: 'El número de tarjeta debe contener solo dígitos' })
  cardNumber: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Formato inválido. Use MM/YY' })
  expiryDate: string;

  @IsString()
  @Length(3, 4)
  @Matches(/^\d+$/, { message: 'CVV inválido' })
  cvv: string;

  @IsString()
  cardholderName: string;
}
