import { IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'])
  status: string;
}
