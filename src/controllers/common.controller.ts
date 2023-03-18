import HouseBank from '../models/house-bank';
import TaxCode from '../models/tax-code';

const getHouseBanks = () => HouseBank.findAll();

const getTaxCodes = (query = {}) => TaxCode.findAll(query);

export { getHouseBanks, getTaxCodes };
