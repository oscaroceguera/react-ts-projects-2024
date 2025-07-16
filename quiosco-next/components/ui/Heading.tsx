type Props = {
  children: React.ReactNode;
};

function Heading(props: Props) {
  const { children } = props;

  return <h1 className="text-2xl my-10">{children}</h1>;
}

export default Heading;
