Novelty search has been applied to evolutionary robotics, most often in the context of neuroevolution (i.e. the
evolution of artificial neural networks or ANNs). Neuroevolution is popular because novelty
search rewards novel behaviors, which requires behaviors to be evolved. One way to evolve behaviors is through ANNs. An
ANN is like a "brain" for a virtual robot that encodes how it will behave.

Instead of returning a fitness value, an evaluation of an individual in the domain should return a characterization
of that individual's behavior. Typically this characterization is a vector of real numbers reflecting important aspects
of what is interesting in the domain. One can then define a behavioral distance metric between different individuals,
which is traditionally the Euclidean distance between two individuals' behavioral characterization vectors.
Although any measure of individual novelty can potentially work, the average distance to the k-nearest neighbors of an
individual in behavior space has proven effective as the novelty metric in several publications. This metric measures
how much a particular area of behavior space has been explored, thereby rewarding individuals in relatively unexplored
areas.

The first step in calculating the novelty of a new individual is to measure its behavioral distance to all other
individuals
in the population and to all individuals in the archive, reflecting how different it is from current behaviors
(i.e. in the current population) as well as behaviors that were novel in the past (i.e. in the archive). The k-nearest
neighbors can be derived from this distance information (i.e. the k individuals that have the smallest distance to the
new individual in the behavior space), and novelty is assigned as the average distance to the k-nearest neighbors.
If a new individual's novelty is high, it is typically added to the archive.
