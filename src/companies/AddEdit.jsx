import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { companyService, alertService } from '@/_services';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  
  // Validaciones
  const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nombre es requerido'),
    description: Yup.string()
        .required('Descripción es requerida')
  });
  
  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, 
    setValue, errors, formState } 
    = useForm({
    resolver: yupResolver(validationSchema)
  });
  
  function onSubmit(data) {
    return isAddMode ? createCompany(data)
        : updateCompany(id, data);
  }
  
  function createCompany(data) {
    return companyService.create(data)
      .then(() => {
        alertService.success('Empresa agregada', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(alertService.error);
  }
  
  function updateCompany(id, data) {
    return companyService.update(id, data)
      .then(() => {
        alertService.success('Empresa actualizada', { keepAfterRouteChange: true });
        history.push('..');
      })
      .catch(alertService.error);
  }
  
  const [company, setCompany] = useState({});
  // const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (!isAddMode) {
      // get user and set form fields
      companyService.getById(id).then(company => {
        const fields = ['name', 'description'];
        fields.forEach(field => 
          setValue(field, company[field]));
        setCompany(company);
      });
    }
  }, []);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode ? 'Agregar Empresa' : 'Editar Empresa'}</h1>
        <div className="form-row">
            <div className="form-group col">
                <label>Nombre</label>
                <input name="name" 
                  type="text" ref={register} 
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group col-6">
                <label>Descripción</label>
                <input name="description" type="text" ref={register} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
        </div>
             
        <div className="form-group">
            <button type="submit" 
              disabled={formState.isSubmitting} 
              className="btn btn-primary">
                {formState.isSubmitting && 
                  <span className="spinner-border spinner-border-sm mr-1"></span>}
                Guardar
            </button>
            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancelar</Link>
        </div>
    </form>
  );
}

export { AddEdit };