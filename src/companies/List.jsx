import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { companyService } from '@/_services';

function List({ match }) {
  const { path } = match;
  const [ companies, setCompanies] = useState(null);
  
  useEffect(() => {
    companyService.getAll().then(x => setCompanies(x));
  }, []);
  
  function deleteCompany(id) {
    setCompanies(companies.map(x => {
        if (x.id === id) { x.isDeleting = true; }
        return x;
    }));
    companyService.delete(id).then(() => {
      setCompanies(companies => companies.filter(x => x.id !== id));
    });
  }
  
  return (
    <div>
        <h1>Empresas</h1>
        <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Agregar Empresa</Link>
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