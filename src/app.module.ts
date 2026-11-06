import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gustavoluis2106_db_user:P2jBJFhV53dX1Qeg@cluster0.e43wre7.mongodb.net/?retryWrites=true&w=majority'),
    TransacoesModule,
  ],
})
export class AppModule {}