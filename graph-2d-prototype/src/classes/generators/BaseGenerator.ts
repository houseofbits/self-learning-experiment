import GraphNode from '@/classes/graph/GraphNode';

export default abstract class BaseGenerator {
    abstract generate(): GraphNode;
    abstract reset(): void;
};