import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { productService } from '@/_services';

function List({ match }) {
  const { path } = match;
  const [products, setProducts] = useState(null);

  useEffect(() => {
    productService.getAll().then(x => setProducts(x));
  }, []);

  function deleteProduct(id) {
    if (window.confirm('¿desea eliminar este producto?')) {
      setProducts(products.map(x => {
        if (x._id === id) { x.isDeleting = true; }
        return x;
      }));
      productService.delete(id).then(() => {
        let prods = products.filter(x => x._id !== id);
        setProducts(prods);
      });
    }
  }
  
  function handleChange(event) {
    // console.log('val: ', event.target.value);
    if(event.target.value.length >= 3){
      let term = event.target.value.toLowerCase();
      //search action
      let prods = products.filter( (prod) => {
        if(prod.title.toLowerCase().includes(term) )
          return prod;
       
        let result = prod.company.map( c => c.name);
        result = result.join();
        console.log(result);
        if(result.toLowerCase().includes(term)){
          console.log(prod);
          return prod;
        }        
      });
      // console.log(prods);
      setProducts(prods);
    }
    if(event.target.value === ""){
      console.log('hola ');
      productService.getAll().then(x => setProducts(x));
    }
    event.preventDefault();
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="col-6">
          <h1>Productos</h1>
          <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Agregar Producto</Link>
        </div>
        <div className="form-inline col-6">
          <input type="search" placeholder="Buscar..." className=" w-100 form-control mr-sm-4" onChange={handleChange} />
        </div>
      </nav>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Nombre</th>
            <th style={{ width: '15%' }}>SKU</th>
            <th style={{ width: '15%' }}>Estatus</th>
            <th style={{ width: '25%' }}>Descripción</th>
            <th style={{ width: '15%' }}>Empresa</th>
            <th style={{ width: '15%' }}></th>
          </tr>
        </thead>
        <tbody>
          {products && products.map(prod =>
            <tr key={prod._id}>
              <td>{prod.title} </td>
              <td>{prod.sku}</td>
              <td>{prod.active ? 'Activo' : 'Inactivo'}</td>
              <td>{prod.description}</td>
              <td>{
                // prod.company?.name
                prod.company.map(c => {
                  return  `${c.name}, `
                })
                }
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>
                  <Link to={`${path}/edit/${prod._id}`}
                      className="btn btn-sm btn-primary mr-1">Editar
              </Link>
                <button
                  onClick={() => deleteProduct(prod._id)}
                  className="btn btn-sm btn-danger btn-delete-user" disabled={prod.isDeleting}>
                  {
                      prod.isDeleting
                          ? <span className="spinner-border spinner-border-sm"></span>
                          : <span>Eliminar</span>
                  }
                </button>
              </td>
            </tr>
          )}
          {!products &&
            <tr>
              <td colSpan="6" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {products && !products.length &&
            <tr>
              <td colSpan="6" className="text-center">
                <div className="p-2">No hay productos para mostar</div>
              </td>
            </tr>
          }
      </tbody>
    </table>
  </div>
  );
}

export { List };