import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HealthStatusDto {
  @Field()
  status: string;

  @Field()
  timestamp: string;

  @Field()
  uptime: number;

  @Field(() => String)
  memoryUsage: string;
}
