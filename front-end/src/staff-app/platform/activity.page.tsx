import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

export const ActivityPage: React.FC = () => {
  const [getActivity, activityData, activityState] = useApi<{ activity: any }>({ url: "get-activities" })
  console.log(activityData, activityState, "activities")

  useEffect(() => {
    void getActivity()
  }, [getActivity])

  return (
    <S.Container>
      <Toolbar />
      {activityState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {activityState === "loaded" && (
        <>
          {activityData?.activity.map((d: any) => (
            <ActivityList key={d.entity.id} data={d} />
          ))}
        </>
      )}
    </S.Container>
  )
}

interface ActivityList {
  data: any
}
const ActivityList: React.FC<ActivityList> = (props) => {
  const { data } = props
  const date = new Date(data.entity.completed_at)
  const dateCombined = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  return (
    <S.ContainerContent>
      <div style={{ marginLeft: "15px" }}>{data.entity.id}</div>

      <div style={{ marginLeft: "0px" }}>{data.entity.name}</div>

      <div style={{ marginRight: "18px" }}>{dateCombined}</div>
    </S.ContainerContent>
  )
}

const Toolbar: React.FC<{}> = (props) => {
  return (
    <S.ToolbarContainer>
      <div>Id</div>
      <div>Name</div>
      <div>Completed At</div>
    </S.ToolbarContainer>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Content: styled.div`
    flex-grow: 1.5;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  ContainerContent: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    color: ${Colors.dark.base};
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    font-weight: bold;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
}
