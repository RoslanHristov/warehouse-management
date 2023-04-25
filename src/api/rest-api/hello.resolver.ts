import { Resolver, Query } from '@nestjs/graphql';
import { RESTDataSource } from 'apollo-datasource-rest';

class HelloAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000';
  }

  async getHello() {
    return this.get('/hello');
  }
}

@Resolver()
export class HelloResolver {
  constructor(private readonly helloAPI: HelloAPI) {}

  @Query(() => String)
  async hello() {
    const result = await this.helloAPI.getHello();
    return result;
  }
}
