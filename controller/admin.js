const { where } = require('sequelize');
const { User } = require('../models');
const { Company } = require('../models');
const { Topic } = require('../models');
const { Tag } = require('../models');
const { Post } = require('../models')
const bcrypt = require('bcryptjs');
exports.getUserManagement = async (req, res, next) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;
        const list = await User.findAll();
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await User.findAndCountAll({
            limit, offset
        })
        const totalPages = Math.ceil(count / limit);
        res.render('user-management', {
            userRole, userImage, list, users, currentPage: page, totalPages
        });
    } catch (error) {
        console.log('err')
    }

}

exports.postUserManagement = async (req, res, next) => {
    try {
        const admin = await User.findOne({ where: { role: 'user' } });
        const date = admin.dob;
        console.log('type', typeof date)
        console.log(admin);
    } catch (error) {

    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        await User.destroy({ where: { id } })

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'User deleted fail' });
    }
}
//add new user 
exports.displayAddUser = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        res.render('add-user', { userRole: admin.role, userImage: admin.image, user: null })
    } catch (error) {

    }
}
exports.addUser = async (req, res) => {
    console.log(req.body);
    try {
        const { email, full_name, role, company, active, date } = req.body;


        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Tạo user mới và lưu vào database
        const newUser = await User.create({
            email,
            dob: date,
            status: active,
            username: full_name,
            role,
            company
        });

        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

//edit_user

exports.displayEditUser = async (req, res) => {
    const { id } = req.params;
    console.log('id nguoi dung', id);
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        console.log(user.role)

        const idUser = await User.findOne({ where: { id } });
        console.log(user.role)

        res.render('edit-user', { userRole: user.role, userImage: user.image, user, users: idUser })
    } catch (error) {

    }
}
exports.editUser = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        const { email, full_name, role, company, active, date } = req.body;
        const updateUser = await User.update({
            email,
            username: full_name,
            role,
            company,
            status: active,
            dob: date,
        }, { where: { id } })

        res.status(201).json({ message: 'User updated successfully.', user: updateUser });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

//render view company



exports.renderCompany = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await User.findAndCountAll({
            include: {
                model: Company,
                as: 'companyData',
                attributes: ['Name', 'Max_users']
            },
            where: { role: 'Company-account' },
            attributes: ['username', 'email', 'status', 'id']
            , required: true,
            limit, offset
        })
        const totalPages = Math.ceil(count / limit);

        res.render('company', {
            userRole, userImage, users, currentPage: page, totalPages
        });
    } catch (error) {
        console.log('err')
    }
}

exports.renderTopic = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await Topic.findAndCountAll({
            limit, offset
        })
        const totalPages = Math.ceil(count / limit);
        res.render('topic', {
            userRole, userImage, users, currentPage: page, totalPages
        });
    } catch (error) {
        console.log('err')
    }
}

exports.renderTag = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await Tag.findAndCountAll({
            limit, offset
        })
        const totalPages = Math.ceil(count / limit);
        res.render('tag', {
            userRole, userImage, users, currentPage: page, totalPages
        });
    } catch (error) {
        console.log('err')
    }
}


exports.displayAddCompany = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const company = await Company.findAll();

        const userRole = admin.role;
        const userImage = admin.image;

        res.render('add-company', {
            userRole, userImage, company
        });
    } catch (error) {
        console.log('err')
    }
}

//logic add company
exports.addCompany = async (req, res) => {
    console.log(req.body)
    const render = await Company.findAll();
    console.log(render)
    try {
        const { Name, Address, Max_users, expired, active } = req.body;
        const newCompany = await Company.create({
            Name,
            Address,
            Max_users,
            status: active,
            expired,
        });
        res.status(201).json({ message: 'User created successfully.', user: newCompany });
    } catch (error) {

    }
}

exports.displayEditCompany = async (req, res) => {
    const { id } = req.params;
    console.log('id nguoi dung', id);
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        console.log(user.role)

        const idUser = await User.findAndCountAll({
            include: {
                model: Company,
                as: 'companyData',
                attributes: ['Name', 'Max_users', 'Address', 'expired']
            },
            where: { role: 'Company-account', id },
            attributes: ['username', 'email', 'status', 'id']
            ,

        })
        const userData = idUser.rows;
        const address = userData[0].companyData.Address;
        const max_users = userData[0].companyData.Max_users;
        const expired = userData[0].companyData.expired;
        res.render('edit-company', { userRole: user.role, userImage: user.image, user, users: idUser, address, max_users, expired })
    } catch (error) {

    }
}
exports.editCompany = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        const { email, full_name, role, company, active, date } = req.body;
        const updateUser = await User.update({
            email,
            username: full_name,
            role,
            company,
            status: active,
            dob: date,
        }, { where: { id } })

        res.status(201).json({ message: 'User updated successfully.', user: updateUser });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


exports.displayAddTopic = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        res.render('add-topic', {
            userRole, userImage,
        });
    } catch (error) {
        console.log('err')
    }
}
exports.addTopic = async (req, res) => {
    const { name } = req.body;
    try {
        await Topic.create({ name });
        res.redirect('/topic-management')
    } catch (error) {
        res.json('khong thanh cong')
    }
}

exports.displayAddTag = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;
        res.render('add-tag', {
            userRole, userImage,
        });
    } catch (error) {
        console.log('err')
    }
}

exports.addTag = async (req, res) => {
    console.log(req.body);
    try {
        const { nametag } = req.body;
        try {
            await Tag.create({ name: nametag });
            res.redirect('/tag-management')
        } catch (error) {
            res.json('khong thanh cong')
        }
    } catch (error) {

    }
}

exports.renderPost = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await Post.findAndCountAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['username']
            },
            limit, offset
        })
        
        const totalPages = Math.ceil(count / limit);

        res.render('post', {
            userRole, userImage, users, currentPage: page, totalPages
        });
    } catch (error) {
        console.log('err')
    }
}

exports.displayAddPost = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { email: req.session.email } });
        const userRole = admin.role;
        const userImage = admin.image;

        res.render('add-post', {
            userRole, userImage,
        });
    } catch (error) {
        console.log('err')
    }
}
exports.addPost = async (req, res) => {
    console.log(req.body);
    const { title, description, tags, status, topic } = req.body;
    try {
        await Post.create({
            title,
            description,
            tag: tags,
            topic,
            status,
             user_id: req.user.id
        })
        res.redirect('/post-management')
    } catch (error) {
        console.log('khong thanh cong')
    }
};
exports.renderDashboard = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        console.log(user.role)
        res.render('dashboard', { userRole: user.role, userImage: user.image, user })
    } catch (error) {

    }
}
