const Permissions = require("./Permissions");

class CrudService extends Permissions {
    constructor(model) {
        super(model);
        this.model = model;
        this.pageSize = 10;
    }

    list = async (query) => {
        let { limit, sort_by, page, include, ...where } = query;
        limit = parseInt(limit) || this.pageSize;
        page = parseInt(page) || 1;

        if (include) include = include.split(' ');

        let order = null;
        if (sort_by) {
            order = sort_by.split(' ').reduce((acc, item) => {
                if (item.charAt(0) == '-') {
                    acc = [...acc, [item.slice(1), "DESC"]]
                } else {
                    acc = [...acc, [item]]
                }
                return acc;
            }, []);
        }

        const offset = (page - 1) * this.pageSize;

        const result = await this.model.findAndCountAll({
            where,
            offset,
            limit,
            order,
            include
        });

        const { rows, count } = result;

        return {
            rows,
            count,
            page,
            page_size: this.pageSize,
            limit
        };
    }

    beforeCreate = async (data) => { }

    create = async (data, req) => {
        try {
            await this.beforeCreate(data, req);
            const createResponse = await this.model.create(data);
            return await this.afterCreate({ data, createResponse });
        } catch (err) {
            console.log(err);
        }
    }

    afterCreate = async ({ data, createResponse }) => {
        return createResponse;
    }

    get = async (id, query) => {
        let { include } = query;
        return await this.model.findByPk(id, { include });
    }

    update = async (id, data) => {
        try{
            await this.model.update(data, {
                where: {
                    id
                }
            });
            return await this.model.findByPk(id);
        }catch(e){
            return Response.error(500);
        }
    }

    delete = async (id) => {
        const instance = await this.model.findByPk(id);
        if (!instance) return { message: "Does not exist!" };
        return instance.destroy();
    }
}

module.exports = CrudService;
