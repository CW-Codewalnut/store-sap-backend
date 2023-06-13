import { NextFunction, Request, Response } from 'express';
import OneTimeCustomer from '../models/one-time-customer';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oneTimeCustomerBody = {
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (req.body.salesHeaderId) {
      Object.assign(oneTimeCustomerBody, { languageKey: req.body.languageKey });
      Object.assign(oneTimeCustomerBody, { street: req.body.street });
      Object.assign(oneTimeCustomerBody, { state: req.body.state });
      Object.assign(oneTimeCustomerBody, { country: req.body.country });
      Object.assign(oneTimeCustomerBody, { gstNumber: req.body.gstNumber });
      Object.assign(oneTimeCustomerBody, { email: req.body.email });
      Object.assign(oneTimeCustomerBody, { bankKey: req.body.bankKey });
      Object.assign(oneTimeCustomerBody, {
        bankAccountNumber: req.body.bankAccountNumber,
      });
      Object.assign(oneTimeCustomerBody, { bankCountry: req.body.bankCountry });
      Object.assign(oneTimeCustomerBody, { reference: req.body.reference });
    }

    const oneTimeCustomerData = await OneTimeCustomer.create(
      oneTimeCustomerBody,
    );

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      oneTimeCustomerData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { create };
