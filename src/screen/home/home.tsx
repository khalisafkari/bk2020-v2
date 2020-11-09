import React from 'react';
import {ScrollView} from 'react-native';
import Slide from '@component/slide';
import styles from './styles';
import {Home as hApi, HomeResults} from 'westmanga-extensions';
import List from 'component/list';
import History from '@component/history';

const Home = (props: any) => {
  const [slide, setSlide] = React.useState<HomeResults[]>([]);
  const [list, setList] = React.useState<HomeResults[]>([]);

  const onCallBack = React.useCallback(() => {
    hApi({page: 1}).then((results: HomeResults[]) => {
      const todos: {
        list: HomeResults[];
        slide: HomeResults[];
      } = {
        slide: [],
        list: [],
      };
      for (let i of results) {
        if (!i.hot) {
          todos.slide.push(i);
        } else {
          todos.list.push(i);
        }
      }
      setList(todos.list);
      setSlide(todos.slide);
    });
  }, []);

  React.useEffect(onCallBack, []);

  return (
    <ScrollView style={styles.container}>
      <Slide componentId={props.componentId} state={slide} />
      <History componentId={props.componentId} />
      <List componentId={props.componentId} list={list} />
    </ScrollView>
  );
};

export default Home;
