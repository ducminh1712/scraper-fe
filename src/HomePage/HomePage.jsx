import React from 'react';
import { Link } from 'react-router-dom';
import { executionService } from '../_services';
import paginate from 'jw-paginate';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            pager: {},
            pageOfItems: [],
            urls: [],
            currentUrl: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNewExecution = this.handleNewExecution.bind(this);
        this.handleAddUrl = this.handleAddUrl.bind(this);
        this.handleRemoveUrl = this.handleRemoveUrl.bind(this);
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user'))
        });
        this.loadPage();
    }

    componentDidUpdate() {
        this.loadPage();
    }

    loadPage() {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        if (page !== this.state.pager.currentPage && this.state.pager.currentPage !== 0) {
            executionService.getExecutions(page, 10)
                .then(({ count, rows }) => {
                    const pager = paginate(count, page, 10)
                    this.setState({ pager, pageOfItems: rows });
                });
        }
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ currentUrl: value });
    }

    handleAddUrl(e) {
        e.preventDefault();
        const { currentUrl, urls } = this.state;
        urls.push(currentUrl);
        this.setState({
            urls,
            currentUrl: ''
        });
    }

    handleNewExecution(e) {
        e.preventDefault();
        const urls = this.state.urls;
        executionService.submitExecution(urls).then(window.location.reload());
    }

    handleRemoveUrl(index, e) {
        e.preventDefault();
        const urls = [...this.state.urls];
        urls.splice(index, 1)
        this.setState({ urls })
    }

    render() {
        const { user, pager, pageOfItems, urls, currentUrl } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.username}!</h1>
                <div className="card text-center m-3">
                    <h3 className="card-header">List of Executions</h3>
                    <form name="form" onSubmit={this.handleNewExecution}>
                        <label>Input URLs:</label>
                        <br />
                        {urls.map(url =>
                            <div key={urls.indexOf(url)}>
                                <label>{url}</label>
                                <button className='btn btn-danger' onClick={(e) => this.handleRemoveUrl(urls.indexOf(url), e)}>Remove</button>
                                <br />
                            </div>
                        )}
                        <input type="text" className="form-control" name="url" value={currentUrl} onChange={this.handleChange} placeholder="https://example.com" />
                        <button className='btn btn-primary' onClick={this.handleAddUrl}>Add URL</button>
                        <button className='btn btn-success'>New Execution</button>
                    </form>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">ID</th>
                                    <th className="text-center" scope="col">Notes</th>
                                    <th className="text-center" scope="col">Created At</th>
                                    <th className="text-center" scope="col">Images</th>
                                    <th className="text-center" scope="col">Videos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageOfItems.map(item =>
                                (<tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.notes ? item.notes : null}</td>
                                    <td>{item.createdAt}</td>
                                    <td>
                                        <Link to={{ pathname: '/images', search: `?executionId=${item.id}&page=1` }} className="btn btn-primary">Details</Link>
                                    </td>
                                    <td>
                                        <Link to={{ pathname: '/videos', search: `?executionId=${item.id}&page=1` }} className="btn btn-danger">Details</Link>
                                    </td>
                                </tr>)
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer pb-0 pt-3">
                        {pager.pages && pager.pages.length &&
                            <ul className="pagination">
                                <li className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                    {pager.currentPage === 1 ?
                                        <Link style={{ pointerEvents: 'none' }} to={{ search: `?page=1` }} className="page-link">First</Link> :
                                        <Link to={{ search: `?page=1` }} className="page-link">First</Link>
                                    }
                                </li>
                                <li className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                    {pager.currentPage === 1 ?
                                        <Link style={{ pointerEvents: 'none' }} to={{ search: `?page=${pager.currentPage - 1}` }} className="page-link">Previous</Link> :
                                        <Link to={{ search: `?page=${pager.currentPage - 1}` }} className="page-link">Previous</Link>
                                    }
                                </li>
                                {pager.pages.map(page =>
                                    <li key={page} className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}>
                                        <Link to={{ search: `?page=${page}` }} className="page-link">{page}</Link>
                                    </li>
                                )}
                                <li className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                    {pager.currentPage === pager.totalPages ?
                                        <Link style={{ pointerEvents: 'none' }} to={{ search: `?page=${pager.currentPage + 1}` }} className="page-link">Next</Link> :
                                        <Link to={{ search: `?page=${pager.currentPage + 1}` }} className="page-link">Next</Link>
                                    }
                                </li>
                                <li className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                    {pager.currentPage === pager.totalPages ?
                                        <Link style={{ pointerEvents: 'none' }} to={{ search: `?page=${pager.totalPages}` }} className="page-link">Last</Link> :
                                        <Link to={{ search: `?page=${pager.totalPages}` }} className="page-link">Last</Link>
                                    }
                                </li>
                            </ul>
                        }
                    </div>
                </div>
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

export { HomePage };