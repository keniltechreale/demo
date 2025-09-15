import * as Utils from '../../lib/utils';
import AdditionalFeesService from '../../services/admin/additionalfees.service';
import paginationConfig from '../../config/pagination.config';
export default new (class AdditionalFeesController {
    constructor() {
        this.addAdditionalFee = (req, res) => {
            try {
                const body = req.body;
                AdditionalFeesService.addAdditionalFee(body)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.viewAllAdditionalFees = (req, res) => {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status,
                };
                AdditionalFeesService.getAllAdditionalFees(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.updateAdditionalFee = (req, res) => {
            try {
                const body = req.body;
                AdditionalFeesService.updateAdditionalFee(body, req.params.id)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.deleteAdditionalFee = (req, res) => {
            try {
                const args = {
                    id: req.params.id,
                };
                AdditionalFeesService.deleteAdditionalFee(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
    }
})();
//# sourceMappingURL=additionalfees.controller.js.map