import Category from "../models/Category.js";

/****************************************************/
/****************************************************/
const saveCategory = async (req,res) => {
    const category = new Category(req.body);
    category.user = req.user._id
    try {
        const newCategory = await category.save();
        res.json({msg:"Category saved",category: newCategory});
    } catch (error) {
        console.log(error);
    }
}

/****************************************************/
/****************************************************/
const listCategories = async (req,res) => {
    const categories = await Category.find().where('user').equals(req.user);
    res.json(categories);
}

/****************************************************/
/****************************************************/

const getCategory = async (req, res) => {
    const {id} = req.params
    const category = await Category.findById(id);
    if(!category){
        return res.status(404).json({msg: "Couldn't find the category"});
    }
    if(category.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    res.json(category);
}

/****************************************************/
/****************************************************/

const updateCategory = async (req, res) => {
    const {id} = req.params
    const category = await Category.findById(id);
    if(!category){
        return res.status(404).json({msg: "Couldn't find the category"});
    }
    if(category.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    try {
        category.name = req.body.name || category.name;
        const categoryUpdated = await category.save();
        res.json({msg:"Category updated",category: categoryUpdated});
    } catch (error) {
        console.log(error);
    }
}
/****************************************************/
/****************************************************/

const deleteCategory = async (req, res) => {
    const {id} = req.params
    const category = await Category.findById(id);
    if(!category){
        return res.status(404).json({msg: "Couldn't find the category"});
    }
    if(category.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    const childCount = await Category.aggregate([
        {
            $match: {_id: category._id}
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "children"
            }
        },
        {
            $project: {
                childCount: {$size: "$children"}
            }
        }
    ]);

    if(childCount[0].childCount > 0){
        return res.status(404).json({msg: "This category contains products, please delete the products first"});
    }
    
    try {
        await category.deleteOne();
        res.json({msg: "Category deleted"});
    } catch (error) {
        console.log(error);
    }
    
}
export {saveCategory, listCategories, getCategory, updateCategory, deleteCategory};

