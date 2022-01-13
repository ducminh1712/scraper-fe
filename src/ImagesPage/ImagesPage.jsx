import React from 'react';
import { Link } from 'react-router-dom';
import { imageService } from '../_services';
import paginate from 'jw-paginate';
import ImageComponent from '../_components/ImageComponent';

class ImagesPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            executionId: null,
            user: {},
            pager: {},
            pageOfItems: []
        };
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
        const executionId = parseInt(params.get('executionId'));
        if (page !== this.state.pager.currentPage) {
            imageService.getImages(executionId, page, 10)
                .then(({ count, rows }) => {
                    const pager = paginate(count, page, 10)
                    this.setState({ pager, pageOfItems: rows, executionId });
                });
        }
    }

    render() {
        const { user, pager, pageOfItems, executionId } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.username}!</h1>
                <div className="card text-center m-3">
                    <h3 className="card-header">List of Images</h3>
                    <div className="card-body">
                        {pageOfItems.map(item =>
                            (<ImageComponent key={item.id} url={item.url} />)
                        )}
                    </div>
                    <div className="card-footer pb-0 pt-3">
                        {pager.pages && pager.pages.length &&
                            <ul className="pagination">
                                <li className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                    <Link to={{ search: `?page=1&executionId=${executionId}` }} className="page-link">First</Link>
                                </li>
                                <li className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                    <Link to={{ search: `?page=${pager.currentPage - 1}&executionId=${executionId}` }} className="page-link">Previous</Link>
                                </li>
                                {pager.pages.map(page =>
                                    <li key={page} className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}>
                                        <Link to={{ search: `?page=${page}&executionId=${executionId}` }} className="page-link">{page}</Link>
                                    </li>
                                )}
                                <li className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                    <Link to={{ search: `?page=${pager.currentPage + 1}&executionId=${executionId}` }} className="page-link">Next</Link>
                                </li>
                                <li className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                    <Link to={{ search: `?page=${pager.totalPages}&executionId=${executionId}` }} className="page-link">Last</Link>
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

export { ImagesPage };