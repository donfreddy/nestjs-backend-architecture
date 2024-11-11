import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  blog_url: string;

  @IsUrl()
  @IsOptional()
  img_url: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  score: number;
}
