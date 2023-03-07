USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[AppointmentTypes_SelectAll]    Script Date: 03/07/23 13:57:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Christopher Doupis>
-- Create date: <01-11-2023T14:24:00>
-- Description:	AppointmentTypes SelectAll
-- Code Reviewer: 


-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

CREATE PROC [dbo].[AppointmentTypes_SelectAll]

/*---TEST CODE---

	Execute [dbo].[AppointmentTypes_SelectAll]

*/

AS

BEGIN

	SELECT [Id]
		   ,[Name]
	FROM [dbo].[AppointmentTypes]

END
GO
