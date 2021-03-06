const { expect } = require('chai');
const sinon = require('sinon');

const ProductsModel = require('../../../models/productsModel');
const connection = require('../../../models/connection');

describe('TEST PRODUCT MODEL', () => {
  describe('When getting all products', () => {
    describe('In succeed case', () => {
      const response = [
        {
          id: 1,
          name: "product A",
        },
        {
          id: 2,
          name: "product B",
        }
      ]

      before(() => {
        sinon.stub(connection, 'execute').resolves([response]);
      });

      after(() => {
        connection.execute.restore();
      })

      it('Should return an array of objects', async () => {
        const products = await ProductsModel.getAll();
        expect(products).to.be.an('array');
      });

      it('The object should have "id" and "name" attributes', async () => {
        const products = await ProductsModel.getAll();
        products.forEach((product) => {
          expect(product).to.have.all.keys('id', 'name');
        })
      });
    });
  });

  describe('When getting a product by id', () => {
    describe('In succeed case', () => {
      const id = '1';
      const sucessIdResponse = {
        "id": 1,
        "name": "product A",
      };
  
      before(async () => {
        const response = [[sucessIdResponse], []]
        sinon.stub(connection, 'execute').resolves(response);
  
      });
  
      after(async () => {
        connection.execute.restore();
      });

      it('Should return the product', async () => {
        const modelResponse = await ProductsModel.findById(id);
          
        expect(modelResponse).to.be.a('object');
        expect(modelResponse).to.be.deep.equal(sucessIdResponse);
      });
    });
  });

  describe('When creating a new product', () => {
    const productName = 'product A';

    const modelResponse = {
      "id": 1,
      "name": 'product A'
    }

    describe('When the product already exists', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([modelResponse]);
      })

      after(() => {
        connection.execute.restore();
      })

      it('Should return an object as response', async () => {
        const check = await ProductsModel.checkIfExists(productName);
        expect(check).to.be.an('object');
      });
    });

    describe('When the product is created', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([modelResponse]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return an object with keys "id", "name"', async () => {
        const newProduct = await ProductsModel.create(productName);
        expect(newProduct).to.be.an('object');
        expect(newProduct).to.have.all.keys('id', 'name');
      })
    });
  });

  describe('When update the product', () => {
    const modelReponse = {
      id: 1,
      name: 'product A',
      quantity: 10,
    }
    describe('When it succeed', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves(modelReponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return an object as response', async () => {
        const product = {
          id: 1,
          name: 'product A',
          quantity: 5
        }
        const updatedProduct = await ProductsModel.update(product.id, product.name, product.quantity);
        expect(updatedProduct).to.be.an('object');
      });

      it('The object should have all keys: "id", "name", "quantity"', async () => {
        const product = {
          id: 1,
          name: 'product A',
          quantity: 5
        }
        const updatedProduct = await ProductsModel.update(product.id, product.name, product.quantity);
        expect(updatedProduct).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('When delete a product from db', () => {
    describe('When it succeed', () => {

      before(() => {
        sinon.stub(connection, 'execute').resolves(true);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Should return true', async () => {
        const id = 1;
        const isDeleted = await ProductsModel.deleteProduct(id);
        expect(isDeleted).to.be.true;
      });
    });
  });

  describe('When search a product by name', () => {
    describe('When it succeed', () => {

      const modelResponse = [
        {
          "id": 1,
          "name": "Martelo de Thor",
        }];
      
      before(() => {
        sinon.stub(connection, 'execute').resolves([modelResponse]);
      });

      after(() => {
        connection.execute.restore();
      });
      
      it('Should return an array of products that contain that name', async () => {
        const searchTerm = 'Martelo';
        const products = await ProductsModel.search(searchTerm);
        expect(products).to.be.an('array');
      });
    });
  });

});