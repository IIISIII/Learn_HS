function Pagination({ total, limit, page, setPage }) {
    const numPages = Math.ceil(total / limit);
  
    return (
      <>
        <div style={{textAlign :"center"}}>
          <a onClick={() => setPage(page - 1)} disabled={page === 1}>
            &lt;&nbsp;
          </a>
          {Array(numPages)
            .fill()
            .map((_, i) => (
              <a
                key={i + 1}
                onClick={() => setPage(i + 1)}
                aria-current={page === i + 1 ? "page" : null}
              >
                {i + 1}&nbsp;
              </a>
            ))}
          <a onClick={() => setPage(page + 1)} disabled={page === numPages}>
            &gt;
          </a>
        </div>
      </>
    );
  }

  export default Pagination;