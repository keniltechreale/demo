import Taxes, { ITaxes } from '../../models/taxes.model';

export default new (class TaxesService {
  async getTaxes() {
    const taxes: ITaxes[] = await Taxes.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']],
    });

    return {
      message: 'Taxes retrieved successfully',
      taxes: taxes,
    };
  }

  async updateTaxes(args: Record<string, unknown>) {
    // Check if taxes exist
    const existingTaxes: ITaxes[] = await Taxes.findAll({
      where: { is_active: true },
    });

    if (existingTaxes.length === 0) {
      // Create new taxes if none exist
      const newTaxes: ITaxes = await Taxes.create(args);
      return {
        message: 'Taxes created successfully',
        taxes: newTaxes,
      };
    } else {
      // Update existing taxes
      const taxId = existingTaxes[0].id;
      await Taxes.update(args, { where: { id: taxId } });

      const updatedTaxes: ITaxes = await Taxes.findOne({
        where: { id: taxId },
      });

      return {
        message: 'Taxes updated successfully',
        taxes: updatedTaxes,
      };
    }
  }
})();
