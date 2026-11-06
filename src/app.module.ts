import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gustavoluis2106_db_user:P2jBJFhV53dX1Qeg@cluster0.e43wre7.mongodb.net/?retryWrites=true&w=majority'),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'public'),
    }),
    TransacoesModule,
  ],
})
export class AppModule {}