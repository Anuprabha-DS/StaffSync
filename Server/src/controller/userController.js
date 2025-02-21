

const admin = require('../model/adminModel');
const Department = require('../model/departmentModel')
const Staff = require('../model/staffModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminRegister = async(req,res)=> {
try{
    const {username,password,email,role} =req.body
    
    if(!username,!password,!email,!role){
        return res.status(500).json({message: "All fields are required"})
    }
    if(role ==="Admin"){
        const existingUser = await admin.findOne({ 
                        where: { 
                            username: username 
                        } 
                    });
            
            if (existingUser) {
                return res.status(500).json({message: "Username already exists"})
            }
            const existingEmail = await admin.findOne({ 
                where: { 
                    email: email 
                            } 
                        });

                if (existingEmail) {
                    return res.status(500).json({message: "Email already exists"})
                }
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await admin.create({
                username,
                password: hashedPassword,
                email,
                role
            });

            // Generate token
            const token = jwt.sign({id: user.id,username: user.username,userrole:user.role},process.env.SECRET_KEY,{ expiresIn: '24h' });
            res.cookie('token',token,{httpOnly:true})
            // return {user: {id: user.id,username: user.username,},token};
            res.status(201).json({message:"success",token})
        }

        if(role ==="Staff"){
            const existingUser = await admin.findOne({ 
                            where: { 
                                username: username 
                            } 
                        });
            if (existingUser) {
                return res.status(500).json({message: "Username already exists"})
            }
            const existingEmail = await Staff.findOne({ 
                where: { 
                    email: email 
                            } 
                        });
    
            if (existingEmail) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await admin.create({
                    username,
                    password: hashedPassword,
                    email,
                    role
                });
    
                // Generate token
                const token = jwt.sign({id: user.id,username: user.username,userrole:user.role},process.env.SECRET_KEY,{ expiresIn: '24h' });
                res.cookie('token',token,{httpOnly:true})
                // return {user: {id: user.id,username: user.username,},token};
                res.status(201).json({message:"success",token})
            }else
                return res.status(500).json({message: "This staff not exists"})
        }else
            return res.status(500).json({message: "This role is wrong"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.adminLogin = async(req,res)=>{
    try{
        const {username,password}=req.body
        
        // const user = await admin.find({username})
        const user = await admin.findOne({ where: { username: username  } })
        
        if(!user){
            return res.status(400).json({message:"Don't have an account? Sign up now to login!"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:'Invaild username or password'})
        }
        const token = jwt.sign(
            {id:user.id,username:user.username,userrole:user.role},process.env.SECRET_KEY,{ expiresIn: '24h' }
        )
        res.cookie('token', token,  { httpOnly: true, secure: false });
        res.status(201).json({message:"success",email:user.email,token,userrole: user.role})

    }
    catch(error){
        res.status(500).json({message: error.message})
    }
    
}

exports.addDepartment = async(req,res)=>{
    try{
        const role = req.user.userrole

        if(role == "Admin")
        {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            const adminId = req.user.id
            
            const{deptName,deptHead,deptType}=req.body
            console.log(deptName,deptHead,deptType);
            
            if(!deptName,!deptHead,!deptType){
                return res.status(500).json({message:"All fields are required"})
        }

        const department = await Department.create({
            deptName: deptName, // Ensure column names match DB schema
            deptHead: deptHead,
            adminId: adminId, // ✅ Assign admin ID from token
            deptType: deptType,

        });
        res.status(201).json({ message: 'success', department });

    }else{
        return res.status(403).json({message: 'Access Denied'})
    }}
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.showDepartment = async(req,res)=>{
    try{
        const adminId = req.user.id
        const role = req.user.userrole
        if(role == "Admin")
        {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            const department = await Department.findAll({where:{adminId : adminId} })
            if(!department){
                return res.status(400).json({message:"Invaild credentials"})
            }
            return res.status(200).json({message: "success", department})
        }
        else{
            return res.status(403).json({message: 'Access Denied'})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const phoneRegex = /^[0-9]{10}$/;

exports.addStaff = async (req, res) => {
    try {
            const role = req.user.userrole
            if(role == "Admin")
            {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            const adminId = req.user.id;  // Get adminId from the token
            const { firstName, lastName, email, phone, position, deptId } = req.body;
            if (!firstName || !lastName || !email || !phone || !position || !deptId) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "Invalid phone number format" });
            }
            const department = await Department.findOne({
                where: {
                    id: deptId,      // Check for the correct departmentId
                    adminId: adminId  // Ensure the department belongs to the admin
                }
            });

            if (!department) {
                // If no department is found or it doesn't belong to the admin
                return res.status(404).json({ message: "Department not found or doesn't belong to the admin" });
            }

        // Create the staff member
        const staff = await Staff.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            position: position,
            departmentId: deptId,  // The department ID
            adminId: adminId       // The admin ID from the token
        });

        // Respond with success and the created staff data
        res.status(201).json({ message: 'Staff created successfully', staff });
    }
        else{
            return res.status(403).json({message: 'Access Denied'})
        }}
     catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.showAllStaff = async(req,res)=>{
    try{
        const role = req.user.userrole
            if(role == "Admin")
            {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            const adminId = req.user.id;
            const staff_data = await Staff.findAll({
                where:{adminId},
                include: [{
                    model: Department,
                    attributes: ['deptName'] // Only fetch department name
                }],
            })
            if(!staff_data){
                return res.status(200).json({message:"No Data Found"})
            }
            
            return res.status(200).json({message:"Success", staff_data})
                }
        else{
            return res.status(403).json({message: 'Access Denied'})
        }}
catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.filterStaff = async(req,res)=>{
    try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const adminId = req.user.id;
        const {id} = req.params;
        console.log(id);
        
            const staff = await Staff.findAll({
                where: {
                    departmentId: id,
                    adminId: adminId
                },
                include: [{
                    model: Department,
                    attributes: ['deptName'] // Fetch only department name
                }],
            });
            if(!staff){
                return res.status(200).json({message:"No Data Found"})
            }
            return res.status(200).json({message:"Success", staff})
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getStaff = async(req,res)=>{
    try{
        const role = req.user.userrole
            if(role == "Admin")
            {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const adminId = req.user.id;
        const {id} = req.params
        const staff =await Staff.findOne({
            where: {id: id,
                adminId:adminId
            }
        })
        if(!staff){
            return res.status(401).json({message:"No Data Found"})
        }
        return res.status(200).json({message:"success",staff})

       
    }
    else{
        return res.status(403).json({message: 'Access Denied'})
    }}
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateStaff = async(req,res)=>{
    try{
        const role = req.user.userrole
            if(role == "Admin")
            {
        const adminId = req.user.id;
        const {id} = req.params
        const {firstName, lastName, phone, position } = req.body;

        // Validate that all required fields are provided
        if (!firstName || !lastName  || !phone || !position ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        const staff =await Staff.findOne({
            where: {id: id,
                adminId:adminId
            }
        })
        if(!staff){
            return res.status(401).json({message:"No Data Found"})
        }
        await Staff.update(
            {
                firstName: firstName || staff.firstName,
                lastName: lastName || staff.lastName,
                phone: phone || staff.phone,
                position: position || staff.position
            },
            {
                where: { id: id } 
            }
        );
        const updatedStaff = await Staff.findOne({ where: { id: id } });
        res.status(201).json({ message: 'success', updatedStaff });

    }
    else{
        return res.status(403).json({message: 'Access Denied'})
    }}catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteStaff = async(req,res)=>{
    try{
        const role = req.user.userrole
            if(role == "Admin")
            {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const adminId = req.user.id;
        const {id} = req.params;
        console.log(id);
        
        const staff =await Staff.findOne({
            where: {id: id,
                adminId:adminId
            }
        })
        if(!staff){
            return res.status(401).json({message:"No Data Found"})
        }
        await Staff.destroy({
            where: {id }
        });
        res.status(200).json({ message: 'deleted_successfully' });

    }
    else{
        return res.status(403).json({message: 'Access Denied'})
    }}catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.staffData =async (req,res)=>{
    try{
        const role = req.user.userrole
        console.log(role);
        
            if(role == "Staff")
            {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
        
                const email = req.user.email;
                const staff =await Staff.findOne({
                    where: {
                        email:email
                    }
                })
                if(!staff){
                    return res.status(401).json({message:"No Data Found"})
                }
                return res.status(200).json({message:"success",staff})
        

        }
        else{
            return res.status(403).json({message: 'Access Denied'})
        }}catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.adminLogout = (req,res)=>{
    try{
        res.clearCookie('token')
        res.status(200).json({message:'logout_successfully'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
   };


    
