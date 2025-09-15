import * as Utils from '../../lib/utils';
import FAQsService from '../../services/admin/faqs.service';
import paginationConfig from '../../config/pagination.config';
export default new (class FAQsController {
    constructor() {
        this.addFAQs = (req, res) => {
            try {
                const body = req.body;
                FAQsService.addFAQs(body)
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
        this.viewAllFAQs = (req, res) => {
            try {
                const args = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
                    search: req.query.search || '',
                    status: req.query.status || '',
                };
                FAQsService.getAllFAQs(args)
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
        this.updateFAQs = (req, res) => {
            try {
                const body = req.body;
                FAQsService.updateFAQs(body, req.params.faqs_id)
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
        this.deleteFAQs = (req, res) => {
            try {
                const args = {
                    faqsId: req.params.faqs_id,
                };
                FAQsService.deleteFAQs(args)
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
//# sourceMappingURL=faqs.controller.js.map