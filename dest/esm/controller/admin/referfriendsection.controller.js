import * as Utils from '../../lib/utils';
import ReferFriendsService from '../../services/admin/referFriendSchema.service';
export default new (class ReferFriendsController {
    constructor() {
        this.UpdateReferFriends = (req, res) => {
            try {
                const body = req.body;
                ReferFriendsService.updateReferFriendSection(body, req.params.type)
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
        this.viewReferFriends = (req, res) => {
            try {
                const args = {
                    type: req.query.type || '',
                };
                ReferFriendsService.getReferFriendSection(args)
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
//# sourceMappingURL=referfriendsection.controller.js.map