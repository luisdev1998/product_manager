import Product from '../models/Product.js'
import Category from '../models/Category.js';

const saveProduct = async (req,res) => {
    const product = new Product(req.body);
    const category = await Category.findById(product.category);
    /************  VALIDACIONES ************/
    if(!category){
        const error = new Error("Category doesn't exist");
        return res.status(404).json({msg: error});
    }
    if(category.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    /***************************************/
    try {
        product.user = req.user;
        const newProduct = await product.save().then(e=>e.populate('category','name'));
        res.json({msg: "Product saved",product:newProduct});
    } catch (error) {
        console.log(error);
    }
}
/****************************************************/
/****************************************************/
const listProduct = async (req,res) => {
    const product = await Product.find().where('user').equals(req.user).populate('category', 'name');
    res.json(product);
}
/****************************************************/
/****************************************************/
const getProduct = async (req,res) => {
    const {id} = req.params
    const product = await Product.findById(id);

    /************  VALIDACIONES ************/
    if(!product){
        const error = new Error("Product doesn't exist");
        return res.status(404).json({msg: error.message});
    }
    if(product.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    /***************************************/

    res.json(product);
}
/****************************************************/
/****************************************************/
const updateProduct = async (req,res) => {
    const {id} = req.params
    const product = await Product.findById(id);
    
    /************  VALIDACIONES ************/
    if(!product){
        const error = new Error("Product doesn't exist");
        return res.status(404).json({msg: error.message});
    }
    if(product.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    if(req.body.category){
        const category = await Category.findById(req.body.category);
        if(!category){
            const error = new Error("Category doesn't exist");
            return res.status(404).json({msg: error.message});
        }
        if(category.user._id.toString() !== req.user._id.toString()){
            return res.status(404).json({msg: 'Invalid action'});
        }
    }
    /***************************************/

    try {
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.amount = req.body.amount || product.amount;
        product.category = req.body.category || product.category;
        await product.save();
        res.json({msg: "Product updated"});
    } catch (error) {
        console.log(error);
    }

}
/****************************************************/
/****************************************************/
const deleteProduct = async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);

    /************  VALIDACIONES ************/
    if(!product){
        const error = new Error("Product doesn't exist");
        return res.status(404).json({msg: error.message});
    }
    if(product.user._id.toString() !== req.user._id.toString()){
        return res.status(404).json({msg: 'Invalid action'});
    }
    /***************************************/
    try {
        const productDeleted = await product.deleteOne();
        res.json({msg: "Product deleted",product:productDeleted});
    } catch (error) {
        console.log(error);
    }
}
/****************************************************/
/****************************************************/

export {
    saveProduct,
    listProduct,
    getProduct,
    updateProduct,
    deleteProduct
}