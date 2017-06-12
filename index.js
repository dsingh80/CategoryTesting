class App {
    constructor(selectors){
        this.form = document.querySelector(selectors.formSelector);
        this.listsHolder = document.querySelector(selectors.listSelector);

        this.products = [];
        this.load();

        this.lastProductID = -1;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(ev){
        ev.preventDefault();

        const prodName = this.form.name.value;
        const prodPrice = this.form.price.value-.01;
        let category = "General";
        if(this.form.category.value == null || this.form.category.value == "")
            category = "General";
        else
            category = this.form.category.value;
        
        const Product = {
            name: prodName,
            price: prodPrice,
            category: category,
            id: this.getProductID()
        }

        const productItem = this.addProduct(Product);

        this.save();
        this.form.reset();
    }

    addProduct(Product){
        const list = this.checkForList(Product.category);

        if(list){
            const newItem = document.createElement("li");
            newItem.classList.add('product');
            newItem.innerHTML = `
                <a href="#${list.id}"><img class="preview" src="http://cdn.smosh.com/sites/default/files/ftpuploads/bloguploads/1113/amazon-reviews-unicorn1.jpg" />
                    <h1 class="name">${Product.name}</h1>
                    <h3 class="price">$${Product.price}</h3>
                </a>
            `;

            list.appendChild(newItem);
            this.products.push(Product);
        }
        else{
            this.createList(Product);
            this.addProduct(Product);
        }
    }

    checkForList(categoryName){
        const moddedName = categoryName.replace(' ', '_');
        return document.querySelector(`#${moddedName}`);
    }

    createList(Product){
        const newList = document.createElement('ul');
        newList.classList.add('products_list');
        newList.setAttribute('id', Product.category.replace(' ', '_'));

        const newHeader = document.createElement('h1');
        newHeader.classList.add('listHeading');
        newHeader.textContent = Product.category;
        this.listsHolder.insertBefore(newList, this.listsHolder.firstChild);
        this.listsHolder.insertBefore(newHeader, this.listsHolder.firstChild);
        return newList;
    }

    getProductID(){
        return ++this.lastProductID;
    }

    save(){
        localStorage.setItem('productsList', JSON.stringify(this.products));
    }

    load(){
        const prods = JSON.parse(localStorage.getItem('productsList'));

        if(!prods)
            return false;
        
        for(let i=0; i<prods.length; i++){
            this.addProduct(prods[i]);
        }
    }

}

const app = new App({formSelector: "#addProductForm", listSelector: "#products"});