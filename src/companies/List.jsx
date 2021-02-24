import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { companyService } from '@/_services';

function List({ match }) {
  const { path } = match;
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    companyService.getAll().then(x => setCompanies(x));
  }, []);

  function deleteCompany(id) {
    if (window.confirm('¿desea eliminar esta empresa?')) {
      setCompanies(companies.map(x => {
        if (x._id === id) { x.isDeleting = true; }
        return x;
      }));
      companyService.delete(id).then(() => {
        setCompanies(companies => companies.filter(x => x._id !== id));
      });
    }
  }
  
  function handleChange(event) {
    if(event.target.value.length >= 3){
      let term = event.target.value.toLowerCase();
      //search action
      let comps = companies.filter( (comp) => {
        if(comp.name.toLowerCase().includes(term) )
          return comp;
      });
      setCompanies(comps);
    }
    if(event.target.value === ""){
      companyService.getAll().then(x => setCompanies(x));
    }
    event.preventDefault();
  }

  return (
    <div>
       <nav className="navbar navbar-light bg-light">
        <div className="col-6">
          <h1>Empresas</h1>
          <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Agregar Empresa</Link>
        </div>
        <div className="form-inline col-6">
          <input type="search" placeholder="Buscar..." className=" w-100 form-control mr-sm-4" onChange={handleChange} />
        </div>
      </nav>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Nombre</th>
            <th style={{ width: '30%' }}>Descripción</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {companies && companies.map(comp =>
            <tr key={comp._id}>
              <td>{comp.name} </td>
              <td>{comp.description}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Link to={`${path}/edit/${comp._id}`}
                  className="btn btn-sm btn-primary mr-1">Editar
                            </Link>
                <button
                  onClick={() => deleteCompany(comp._id)}
                  className="btn btn-sm btn-danger btn-delete-user" disabled={comp.isDeleting}>
                  {
                    comp.isDeleting
                      ? <span className="spinner-border spinner-border-sm"></span>
                      : <span>Eliminar</span>
                  }
                </button>
              </td>
            </tr>
          )}
          {!companies &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {companies && !companies.length &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">No hay empresas para mostar</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export { List };