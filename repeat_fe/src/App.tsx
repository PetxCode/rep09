import { useEffect, useState } from "react";
import { MdClose, MdNoteAdd } from "react-icons/md";
import styled from "styled-components";

const App = () => {
  const url: string = "http://localhost:4400/api/get";

  const [data, setData] = useState({});
  const [toggle, setToggle] = useState<boolean>(false);

  const [task, setTask] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const onToggle = () => {
    setToggle(!toggle);
  };

  const dataTitle = Object.keys(data);
  const dataValues = Object.values(data);

  const getData = () => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setData(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmitHandle = () => {
    const URL: string = "http://localhost:4400/api/post-task";
    fetch(URL, {
      method: "POST",
      body: JSON.stringify({ desc, task }),
    }).then(() => {
      setTask("");
      setDesc("");
      setToggle(false);
      window.location.reload();
    });
  };

  const moveToStrted = (id: string) => {
    const URL: string = `http://localhost:4400/api/started/${id}`;

    fetch(URL, { method: "PATCH" }).then(() => {
      window.location.reload();
    });
  };

  return (
    <MainHolder>
      <MainContainer>
        <Container>
          <MainTop>
            {dataTitle?.map((el: any) => {
              return (
                <Top>
                  <span>{el === "started" ? "Progress" : el}</span>
                  {el === "task" && <MdNoteAdd size={20} onClick={onToggle} />}
                </Top>
              );
            })}
          </MainTop>
          <MainTop>
            {dataValues?.map((el: any) => (
              <div>
                {el?.map((props: any) => (
                  <Main>
                    <Content>
                      <Avatar />
                      <Context>
                        <Task>Task: {props.task}</Task>
                        <Task desc>{props.desc}</Task>
                        <Task desc date>
                          {props.date}
                        </Task>
                        <ButtonDiv>
                          <Button
                            b={
                              props.started
                                ? "black"
                                : props.started && props.done
                                ? ""
                                : "#5500ff"
                            }
                            onClick={() => {
                              props.started === false && moveToStrted(props.id);
                            }}
                          >
                            {props?.started ? "Move to Done" : "Start Task"}
                          </Button>
                        </ButtonDiv>
                      </Context>
                    </Content>
                  </Main>
                ))}
              </div>
            ))}
          </MainTop>
        </Container>
      </MainContainer>

      {toggle && (
        <InputContainer>
          <MdClose onClick={onToggle} />

          <MainInput>
            <InputLabel>Enter Task</InputLabel>
            <Input
              placeholder="Enter Task"
              value={task}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTask(e.target.value);
              }}
            />
            <InputLabel>Enter Description</InputLabel>
            <Input
              placeholder="Enter Description"
              value={desc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDesc(e.target.value);
              }}
            />

            <ButtonAdd onClick={onSubmitHandle}>Add Task</ButtonAdd>
          </MainInput>
        </InputContainer>
      )}
    </MainHolder>
  );
};

export default App;

const ButtonAdd = styled.button`
  padding: 15px 0;
  border: 0;
  outline: none;
  background-color: black;
  color: white;
  border-radius: 5px;
  font-family: Poppins;
  cursor: pointer;
  transition: all 350ms;
  margin-top: 15px;

  &:hover {
    transform: scale(1.01);
  }
`;

const Input = styled.input`
  border: 1px solid silver;
  border-radius: 3px;
  outline: none;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #e9ecff;

  &::placeholder {
    font-family: Poppins;
  }
`;

const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
`;

const MainInput = styled.section`
  width: 400px;
  border: 1px solid silver;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;

  background: rgba(248, 246, 252, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div<{ b?: string }>`
  margin-top: 20px;
  background-color: ${({ b }) => b};
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Task = styled.div<{ desc?: boolean; date?: boolean }>`
  font-size: ${({ desc }) => desc && "12px"};
  font-weight: ${({ desc }) => (desc ? "normal" : "500")};
  margin-top: ${({ date }) => date && "10px"};
  text-transform: capitalize;
  width: 75%;
`;

const Context = styled.div`
  line-height: 1;
  width: 75%;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border: 1px solid black;
  border-radius: 50%;
  object-fit: cover;
`;

const Content = styled.div`
  display: flex;
  gap: 5px;
  padding: 10px;
  margin: 10px;
  border: 1px solid silver;
  /* width: 250px; */
`;

const Top = styled.div`
  margin: 10px;
  border: 1px solid silver;
  border-radius: 5px;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  width: 300px;
`;

const MainTop = styled.div`
  width: 100%;
  border-radius: 5px;
  /* border: 1px solid silver; */
  margin-top: 10px;
  display: flex;
  gap: 5px;
  margin: 10px 0;
`;

const Main = styled.div`
  width: 330px;
  border-radius: 5px;
  /* border: 1px solid silver; */
  margin-top: 10px;
`;

const Container = styled.div`
  width: 1000px;
  min-height: 500px;
  border-radius: 5px;
  border: 1px solid silver;
  padding: 0 10px;

  min-height: 100%;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 80px;
`;

const MainHolder = styled.div`
  position: relative;
`;
