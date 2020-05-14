export default {
    create: async(req,res,next) => {
        try{
            const {
                name,
            } = req.body;
            const userMeta = await UserMeta.findOne({user: req.user._id});
            const team = await Team.findOne({
                name: name,
                organization: userMeta.organization
            });
            if(team){
                return res.status(400).send({
                    error: true,
                    message: `Team with name ${name} already exists`,
                    data: null,
                });
            }
            const newTeam = await Team.create({
                name: name,
                organization: userMeta.organization,
                createdBy: req.user._id,
                owners: [req.user._id],
                member_list: [req.user._id]
            });
            return res.status(200).send({
                error: false,
                data: newTeam,
                message: "New team created"
            });
        }catch(e){
            Logger.error(`[ERROR] Error in creating team`,e);
            return res.status(500).send({
                error: true,
                data: null,
                message: "Something went wrong!"
            });
        }
    }
}