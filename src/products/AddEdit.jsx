import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { productService, companyService, alertService } from '@/_services';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  
  // Validaciones
  const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Nombre es requerido'),
    company: Yup.string()
        .required('Empresa es requerida'),
    description: Yup.string()
        .required('Descripción es requerida'),
  });
  
  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, errors, formState } 
    = useForm({ resolver: yupResolver(validationSchema) });
  
  function onSubmit(data) {
    return isAddMode ? createProduct(data) : updateProduct(id, data);
  }
  
  function createProduct(data) {
    const product = { ...data, sku: makeSKU(), active: true }
    return productService.create(product)
      .then((res) => {
        alertService.success('Producto agregado', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(alertService.error);
  }
  
  function updateProduct(id, data) {
    return productService.update(id, data)
      .then(() => {
        alertService.success('Producto actualizado', { keepAfterRouteChange: true });
        history.push('..');
      })
      .catch(alertService.error);
  }
  
  function makeSKU(length = 7) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
  
  const [product, setProduct] = useState({});
  const [ companies, setCompanies] = useState(null);
  // const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    companyService.getAll().then(x => setCompanies(x));
    
    if (!isAddMode) {
      // get user and set form fields
      productService.getById(id).then(product => {
        const fields = ['title', 'company', 'description'];
        fields.forEach(field => setValue(field, product[field]));
        setProduct(product);
      });
    }
  }, []);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode ? 'Agregar Producto' : 'Editar Producto'}</h1>
        { console.log(product) }
        <div className="form-row">
            <div className="form-group col-6">
                <label>Nombre</label>
                <input name="title" 
                  type="text" 
                  ref={register} 
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.title?.message}</div>
            </div>
            <div className="form-group col-6">
                <label>Empresa</label>
                <select name="company" 
                  ref={register} 
                  className={`form-control ${errors.company ? 'is-invalid' : ''}`}>
                  <option value=""></option>
                  {
                    companies && companies.map(comp => 
                      <option key={comp._id} value={comp._id}>{comp.name}</option>
                    )
                  }
                </select>
                <div className="invalid-feedback">{errors.company?.message}</div>
            </div>
            <div className="form-group col-12">
                <label>Descripción</label>
                <input name="description" type="text" ref={register} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
        </div>
             
        <div className="form-group">
            <button type="submit" 
              disabled={ formState.isSubmitting } 
              className="btn btn-primary">
              { formState.isSubmitting && 
                  <span className="spinner-border spinner-border-sm mr-1"></span>}
                Guardar
            </button>
            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancelar</Link>
        </div>
    </form>
  );
}

export { AddEdit };