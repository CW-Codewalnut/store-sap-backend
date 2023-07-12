import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import BusinessTransaction from '../models/business-transaction';
import GlAccount from '../models/gl-account';
import BankAccount from '../models/bank-account';
import Plant from '../models/plant';
import Module from '../models/module';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { getHouseBanks, getTaxCodes } from './common.controller';
import { getIdArrays } from '../utils/helper';
import MESSAGE from '../config/message.json';
import ModuleModel from '../interfaces/masters/module.interface';

function getBusinessTransactions(moduleId: string) {
  return BusinessTransaction.findAll({
    where: { moduleId },
  });
}

const getBusinessTransactionsByModuleId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { moduleId } = req.params;

    const businessTransactions = await getBusinessTransactions(moduleId);

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      businessTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

function getBankAccounts(houseBankIds: string[]) {
  return BankAccount.findAll({
    where: {
      houseBankId: {
        [Op.in]: houseBankIds,
      },
    },
  });
}

function getGlAccounts(businessTransactionIds: string[]) {
  return GlAccount.findAll({
    where: {
      businessTransactionId: {
        [Op.in]: businessTransactionIds,
      },
    },
  });
}

function getQuery(module: ModuleModel) {
  let query = {};
  if (module?.name === 'PETTY_CASH') {
    query = { where: { groupName: { [Op.eq]: 'Zero Tax codes' } } };
  }
  return query;
}

const getMasters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { moduleId } = req.params;
    const businessTransactions = await getBusinessTransactions(moduleId);
    const businessTransactionIds = getIdArrays(businessTransactions);
    const glAccounts = await getGlAccounts(businessTransactionIds);
    const houseBanks = await getHouseBanks();
    const houseBankIds = getIdArrays(houseBanks);
    const bankAccounts = await getBankAccounts(houseBankIds);
    const plants = await Plant.findAll();
    const module = await Module.findByPk(moduleId);

    let taxCodes;
    if (module) {
      const query = getQuery(module);
      taxCodes = await getTaxCodes(query);
    }

    const masterList = {
      businessTransactions,
      glAccounts,
      taxCodes,
      houseBanks,
      bankAccounts,
      plants,
    };

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      masterList,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getBusinessTransactionsByModuleId, getMasters };
