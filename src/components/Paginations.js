import Pagination from 'react-bootstrap/Pagination';

function Paginations({ total, limit, page, setPage }) {
    const numPages = Math.ceil(total / limit);
  
    return (
      <>
      <div style={{marginLeft:"38%"}}>
        <Pagination style={{textAlign :"center", fontFamily:"SUIT-Regular",fontWeight:"100",}}>
          <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1}>
            &lt;&nbsp;
          </Pagination.Prev>
          {Array(numPages)
            .fill()
            .map((_, i) => (
              <Pagination.Item
                key={i + 1}
                onClick={() => setPage(i + 1)}
                aria-current={page === i + 1 ? "page" : null}
              >
                {i + 1}&nbsp;
              </Pagination.Item>
            ))}
          <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === numPages}>
            &gt;
          </Pagination.Next>
        </Pagination>
        </div>
      </>
    );
  }

  export default Paginations;