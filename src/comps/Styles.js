import styled from "styled-components"

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const DashContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Gap = styled.div`
  width: 12px;
  height: 12px;
`

export const Spacer = styled.div`
  flex: 1;
`

export const HR = styled.div`
  height: 2px;
  background-color: #eee;
`

export const DashCard = styled.div`
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 12px;
  margin: 18px;
`

export const Button = styled.button`
  color: #082333;
  font-size: 16px;
  padding: 8px;
  border: 2px solid #8fa6b2;
  border-radius: 6px;
  background: transparent;
  padding-left: 16px;
  padding-right: 16px;
  cursor: pointer;
  &:hover {
    border: 2px solid #ccd9df;
  }
`
export const Button1 = styled.button`
  color: #fff;
  font-size: 14px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: ${props => {
    return (
      (!props.bg && "#27ae60") ||
      (props.bg === "subtle" && "#9E9E9E") ||
      (props.bg === "transparent" && "transparent") ||
      (props.bg === "red" && "#ef5350") ||
      (props.bg === "blue" && "#1B9CFC") ||
      (props.bg === "brown" && "#e67e22")
    )
  }};
  padding-left: 16px;
  padding-right: 16px;
  margin-left: ${props=> props.marginLeft?"8px":"0px"}
  margin-right: ${props=> props.marginRight?"8px":"0px"}
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`

export const PageTitle = styled.h2`
  padding-left: 18px;
`
