import Table from 'react-bootstrap/Table';

function NoticeTable({ print_table,dataArr}) {
  return (
    
    <Table hover style={{ fontSize:"15px", fontFamily:"godic", textAlign: "center",margin:"20px", border: "1px solid #dddddd"}}>
    <thead>
        <tr>
            <th scope="col" style={{ textAlign:"center"}}>번호</th>
            <th scope="col" style={{ textAlign:"center"}}>과목</th>
            <th scope="col" style={{ textAlign:"center"}}>공지 제목</th>
            <th scope="col" style={{textAlign:"center"}}>작성일</th>
        </tr> 
    </thead>
    
    { dataArr && print_table(dataArr) }
</Table> 
  );
}

export default NoticeTable;