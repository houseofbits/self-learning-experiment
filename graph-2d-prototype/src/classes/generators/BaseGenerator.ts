import GraphNode from '@/classes/graph/GraphNode';
import type Graph from "@/classes/graph/Graph";

export default abstract class BaseGenerator<T, TNode> {
    abstract generate(currentGraph: T | null): TNode;
    abstract reset(): void;
};