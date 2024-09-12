import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class AddDocumentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  content: string;
}
