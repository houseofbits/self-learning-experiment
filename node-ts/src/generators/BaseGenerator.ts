import GraphNode from '@/graph/GraphNode';

export default abstract class BaseGenerator {
    abstract generate(): GraphNode;
    abstract reset(): void;
};