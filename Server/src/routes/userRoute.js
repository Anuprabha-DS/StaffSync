const express = require('express')
const {adminRegister,adminLogin,addDepartment,showDepartment,addStaff,
    showAllStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    adminLogout,
    filterStaff,
    staffData


}=require('../controller/userController')
const {authUser, authorizeRole}=require('../middleware/userMiddleware')

const router = express.Router()

router.post('/admin/register',adminRegister)
router.post('/admin/login',adminLogin)
router.post('/admin/department_register',authUser,addDepartment)
router.get('/admin/show_department',authUser,showDepartment)
router.post('/admin/department/staff',authUser,addStaff)
router.get('/admin/department/all_staff',authUser,showAllStaff)
router.get('/admin/department/:id/staff_data',authUser,getStaff)
router.get('/admin/department/:id/filter_staff',authUser,filterStaff)
router.put('/admin/department/:id/update_staff',authUser,updateStaff)
router.delete('/admin/department/:id/delete_staff',authUser,deleteStaff)
router.get('/admin/logout',adminLogout)
router.get('staff/profile',staffData)



module.exports=router