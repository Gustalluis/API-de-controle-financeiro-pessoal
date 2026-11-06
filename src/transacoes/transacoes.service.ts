import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name) private transacaoModel: Model<TransacaoDocument>,
  ) {}

  async create(createTransacaoDto: CreateTransacaoDto): Promise<Transacao> {
    const novaTransacao = new this.transacaoModel(createTransacaoDto);
    return novaTransacao.save();
  }

  async findAllConsolidado() {
    const historico = await this.transacaoModel.find().exec();

    let saldoTotal = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    historico.forEach((t) => {
      if (t.tipo === 'receita') {
        saldoTotal += t.valor;
      } else if (t.tipo === 'despesa') {
        saldoTotal -= t.valor;
        totalDespesas += t.valor;

        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    });

    return {
      historico,
      metricas: {
        saldoTotal,
        totalDespesas,
        totalGastoImpulso,
      },
    };
  }
}