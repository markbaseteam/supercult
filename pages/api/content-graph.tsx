import type { NextApiRequest, NextApiResponse } from "next";
import ContentGraph from "../../utils/ContentGraph";
import { Post } from "../../utils/types";

type Data = {
  graph: Post[];
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ graph: ContentGraph.posts });
};
