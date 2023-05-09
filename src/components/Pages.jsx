import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "..";
import { Pagination } from "react-bootstrap";


export const Pages = observer(() => {
    const {review} = useContext(Context);

    const pageCount = Math.ceil(review.totalCount / review.limit);
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1);
        
    }

    return(
        <Pagination className="mt-5">
  {pages.map((page) => (
    <Pagination.Item
      key={page}
      active={review.page === page}
      onClick={() => review.setPage(page)}
      className={review.page === page ? "active" : ""}
    >
      {page}
    </Pagination.Item>
  ))}
</Pagination>
    )
})