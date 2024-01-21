import GraphNode from '@/classes/graph/GraphNode';
import type Graph from "@/classes/graph/Graph";

export default abstract class BaseGenerator {
    abstract generate(currentGraph: Graph | null): GraphNode;
    abstract reset(): void;
};