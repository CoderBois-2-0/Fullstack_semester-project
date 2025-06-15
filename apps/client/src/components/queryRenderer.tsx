import { type ReactNode } from "react";
import { type UseQueryResult } from "@tanstack/react-query";

function QueryRenderer<T>(props: {
  query: UseQueryResult<T, Error>;
  renderFn: (data: NonNullable<T>) => ReactNode;
  noDataRender?: () => ReactNode;
}) {
  if (props.query.data) {
    return props.renderFn(props.query.data);
  } else {
    return props.noDataRender ? (
      props.noDataRender()
    ) : (
      <div>
        <p>Nothing to see here</p>
      </div>
    );
  }
}

export default QueryRenderer;
