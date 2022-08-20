import cytoscape from "cytoscape";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
const COSEBilkent = require("cytoscape-cose-bilkent");

cytoscape.use(COSEBilkent);

interface GraphProps {
  elements: cytoscape.ElementDefinition[];
}

export default function Graph(props: GraphProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [cytoscapeCore, setCytoscapeCore] = useState<cytoscape.Core>();
  const [graphElements, setGraphElements] = useState<
    cytoscape.ElementDefinition[]
  >(props.elements);
  const layoutOptions = {
    name: "cose-bilkent",
    animate: true,
    padding: props.elements.length === 1 ? 100 : 50,
    fit: true,
  };

  useEffect(() => {
    cytoscapeCore?.on("click", "node", (e) => {
      router.push("/" + e.target.id());
    });

    cytoscapeCore?.on("tap", "node", (e) => {
      router.push("/" + e.target.id());
    });

    cytoscapeCore?.on("mouseover", "node", (e) => {
      document.body.style.cursor = "pointer";

      var sel = e.target;
      cytoscapeCore
        .elements()
        .difference(sel.outgoers().union(sel.incomers()))
        .not(sel)
        .addClass("semitransp");
      sel
        .addClass("highlight")
        .outgoers()
        .union(sel.incomers())
        .addClass("highlight");
    });

    cytoscapeCore?.on("mouseout", "node", (e) => {
      document.body.style.cursor = "default";
      var sel = e.target;
      cytoscapeCore.elements().removeClass("semitransp");
      sel
        .removeClass("highlight")
        .outgoers()
        .union(sel.incomers())
        .removeClass("highlight");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cytoscapeCore]);

  useEffect(() => {
    const sortedPropsElements = props.elements.sort();
    const sortedGraphElements = graphElements.sort();
    let sameProps = true;
    for (let i = 0; i < sortedPropsElements.length; i++) {
      const propElement = sortedPropsElements[i];
      const graphElement = sortedGraphElements[i];
      if (
        !graphElement ||
        (propElement.data.source !== graphElement.data.source &&
          propElement.data.target !== graphElement.data.target)
      ) {
        sameProps = false;
      }
    }

    if (!sameProps) {
      setGraphElements(sortedPropsElements);
      cytoscapeCore?.resize();
      cytoscapeCore?.layout(layoutOptions).run();

      cytoscapeCore?.fit(undefined, 50);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <CytoscapeComponent
      elements={graphElements}
      cy={(cy) => {
        setCytoscapeCore(cy);
      }}
      style={{ height: "100%", position: "static" }}
      stylesheet={[
        {
          selector: "node",
          style: {
            width: 30,
            height: 30,
            backgroundColor: `#829191`,
            color: resolvedTheme === "dark" ? "#eee" : "#4B5563",
            "font-size": "12px",
          },
        },
        {
          selector: "node:selected",
          style: {
            backgroundColor: "rgb(251, 191, 36)",
            label: "data(label)",
            color: resolvedTheme === "dark" ? "white" : "black",
            "font-size": "12px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 5,
            "line-color": "rgb(82, 82, 82)",
          },
        },
        {
          selector: "node.highlight",
          style: {
            // backgroundColor: "rgb(251, 191, 36)",
            label: "data(label)",
          },
        },
        {
          selector: "node.semitransp",
          style: { opacity: 0.5 },
        },
        {
          selector: "edge.highlight",
          style: {
            "line-color": "#829191",
          },
        },
        {
          selector: "edge.semitransp",
          style: { opacity: 0.2 },
        },
      ]}
      layout={layoutOptions}
    />
  );
}
