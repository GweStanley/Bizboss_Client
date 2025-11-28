import { Pagination as BsPagination } from 'react-bootstrap';

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <BsPagination>
      <BsPagination.Prev disabled={page<=1} onClick={()=>onPage(page-1)} />
      {[...Array(totalPages)].map((_,i)=>(
        <BsPagination.Item key={i} active={i+1===page} onClick={()=>onPage(i+1)}>{i+1}</BsPagination.Item>
      ))}
      <BsPagination.Next disabled={page>=totalPages} onClick={()=>onPage(page+1)} />
    </BsPagination>
  );
}
